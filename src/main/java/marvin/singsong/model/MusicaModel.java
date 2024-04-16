package marvin.singsong.model;

import javax.persistence.*;

@Entity
public class MusicaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn
    private Integer id;
    private String musica;
    private String cifra;
    private Integer id_bloco;

    @Lob
    private String letra;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMusica() {
        return musica;
    }

    public void setMusica(String musica) {
        this.musica = musica;
    }

    public Integer getId_bloco() {
        return id_bloco;
    }

    public void setId_bloco(Integer id_bloco) {
        this.id_bloco = id_bloco;
    }

    public String getCifra() {
        return cifra;
    }

    public void setCifra(String cifra) {
        this.cifra = cifra;
    }

    public String getLetra() {
        return letra;
    }

    public void setLetra(String letra) {
        this.letra = letra;
    }
}
