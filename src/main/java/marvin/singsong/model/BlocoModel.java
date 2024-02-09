package marvin.singsong.model;

import javax.persistence.*;

@Entity
public class BlocoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn
    private Integer id;
    private String bloco;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBloco() {
        return bloco;
    }

    public void setBloco(String bloco) {
        this.bloco = bloco;
    }
}
