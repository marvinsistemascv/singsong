package marvin.singsong.model;


import javax.persistence.*;

@Entity
public class UsuarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn
    private Integer id;
    private String nome;
    private String email;
    private String senha;
    private String tipo;
    private String sit;
    private String data_cad;
    private String hora_cad;

    public String getSit() {
        return sit;
    }

    public void setSit(String sit) {
        this.sit = sit;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getData_cad() {
        return data_cad;
    }

    public void setData_cad(String data_cad) {
        this.data_cad = data_cad;
    }

    public String getHora_cad() {
        return hora_cad;
    }

    public void setHora_cad(String hora_cad) {
        this.hora_cad = hora_cad;
    }
}
