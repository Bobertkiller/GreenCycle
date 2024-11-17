from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import random
import string

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5500"}})

# Caminho absoluto para o banco de dados
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.path.join(BASE_DIR, 'instance', 'store.db')

# Configuração do SQLite com o caminho absoluto
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    points = db.Column(db.Integer, nullable=False, default=0)
    resgatados = db.relationship('UserProduct', backref='user', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    image = db.Column(db.String(200), nullable=False)  # Nome do arquivo da imagem
    points = db.Column(db.Integer, nullable=False)

# Modificação da classe UserProduct para incluir o código gerado
class UserProduct(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    resgatado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    code = db.Column(db.String(8), unique=True, nullable=True)  # Adicionado campo para armazenar o código
    product = db.relationship('Product', backref=db.backref('user_resgatados', lazy=True))

# Função para gerar um código aleatório (por exemplo, um código de 8 caracteres)
def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

# Inicialização do banco de dados (executar apenas uma vez)
with app.app_context():
    db.create_all()

# Endpoint para listar produtos com URL completa da imagem
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    products_list = []
    for product in products:
        products_list.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "points": product.points,
            "image": product.image  # Apenas o nome do arquivo
        })
    return jsonify(products_list)

# Endpoint de login do usuário
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({"success": True, "user_id": user.id, "points": user.points})
    return jsonify({"success": False, "error": "Credenciais inválidas"}), 401

# Endpoint de cadastro do usuário
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "error": "Username já está em uso"}), 400

    new_user = User(username=username, password=password, points=1000)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True}), 201

# Endpoint para retornar o saldo de pontos do usuário
@app.route('/api/user/<int:user_id>/points', methods=['GET'])
def get_user_points(user_id):
    user = db.session.get(User, user_id)
    if user:
        return jsonify({"points": user.points})
    return jsonify({"error": "Usuário não encontrado"}), 404

# Endpoint para resgatar produto
@app.route('/api/user/<int:user_id>/resgatar', methods=['POST'])
def resgatar_produto(user_id):
    user = db.session.get(User, user_id)
    product_id = request.json.get('product_id')
    product = db.session.get(Product, product_id)

    if not user or not product:
        return jsonify({"error": "Usuário ou produto não encontrado"}), 404

    if user.points < product.points:
        return jsonify({"error": "Pontos insuficientes"}), 400

    user.points -= product.points
    # Gerar código único para o produto resgatado
    code = generate_code()
    resgatado = UserProduct(user_id=user.id, product_id=product.id, resgatado_em=datetime.utcnow(), code=code)
    db.session.add(resgatado)
    db.session.commit()
    return jsonify({"success": True, "new_balance": user.points, "code": code})

# Endpoint para listar produtos resgatados do usuário (ordenados do mais recente para o mais antigo)
@app.route('/api/user/<int:user_id>/resgatados', methods=['GET'])
def listar_resgatados(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404

    # Ordena pelos produtos resgatados mais recentes
    resgatados = UserProduct.query.filter_by(user_id=user_id).order_by(UserProduct.resgatado_em.desc()).all()
    
    response = [
        {
            "product_id": resgatado.product.id,
            "name": resgatado.product.name,
            "description": resgatado.product.description,
            "image": resgatado.product.image,
            "resgatado_em": resgatado.resgatado_em.strftime("%Y-%m-%d"),
            "code": resgatado.code
        }
        for resgatado in resgatados
    ]
    return jsonify(response)


# Endpoint para limpar produtos resgatados há mais de duas semanas
@app.route('/api/clean_old_resgatados', methods=['POST'])
def clean_old_resgatados():
    two_weeks_ago = datetime.utcnow() - timedelta(weeks=2)
    old_resgatados = UserProduct.query.filter(UserProduct.resgatado_em < two_weeks_ago).all()

    for resgatado in old_resgatados:
        db.session.delete(resgatado)

    db.session.commit()
    return jsonify({"success": True, "message": "Produtos resgatados antigos foram removidos."})

# Rota para servir imagens da pasta de frontend
@app.route('/assets/img/<path:filename>')
def serve_image(filename):
    # Caminho absoluto para o diretório de imagens com a barra final para garantir a estrutura correta
    image_directory = os.path.abspath('../frontend/assets/img/')  # Caminho correto no frontend
    return send_from_directory(image_directory, filename)

# Endpoint para obter informações do usuário (apenas nome)
@app.route('/api/user/<int:user_id>', methods=['GET'])
def get_user_info(user_id):
    try:
        user = db.session.get(User, user_id)
        if user:
            return jsonify({"username": user.username})
        else:
            return jsonify({"error": "Usuário não encontrado"}), 404
    except Exception as e:
        print(f"Erro ao buscar usuário: {e}")
        return jsonify({"error": "Erro interno do servidor"}), 500

# Endpoint para atualizar a senha do usuário
@app.route('/api/user/<int:user_id>/update-password', methods=['POST'])
def update_user_password(user_id):
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({"error": "Usuário não encontrado"}), 404

    data = request.json
    new_password = data.get('password')

    # Atualiza a senha do usuário
    user.password = new_password
    db.session.commit()

    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)
