package marvin.singsong.model;

import javax.persistence.*;

@Entity
public class MusicaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn
    private Integer id;
    private String musica;
    private Integer id_bloco;

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
}
