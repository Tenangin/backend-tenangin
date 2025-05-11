const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../src/index'); // Pastikan app diekspor dari src/index.js
const supabase = require('../src/config/supabase');

chai.use(chaiHttp);

describe('Auth API', () => {
  before(async () => {
    // Hapus user test jika ada
    await supabase
      .from('users')
      .delete()
      .eq('email', 'testuser@example.com');
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'password123',
          confirm_password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message', 'Registrasi berhasil');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('id');
          expect(res.body.user).to.have.property('email', 'testuser@example.com');
          done();
        });
    });

    it('should fail if passwords do not match', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send({
          username: 'testuser2',
          email: 'testuser2@example.com',
          password: 'password123',
          confirm_password: 'password321'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error', 'Password dan konfirmasi password tidak sama');
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with correct credentials', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Login berhasil');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('email', 'testuser@example.com');
          done();
        });
    });

    it('should fail login with wrong password', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error', 'Password salah');
          done();
        });
    });

    it('should fail login with non-existent email', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error', 'User tidak ditemukan');
          done();
        });
    });
  });
});
