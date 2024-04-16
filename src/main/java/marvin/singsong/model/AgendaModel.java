package marvin.singsong.model;

import javax.persistence.*;

@Entity
public class AgendaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn
    private Integer id;
    private String data_evt;
    private String local_evt;
    private String cor_evt;
    private Double cache;
    private String sit;


    public String getCor_evt() {
        return cor_evt;
    }

    public void setCor_evt(String cor_evt) {
        this.cor_evt = cor_evt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getData_evt() {
        return data_evt;
    }

    public void setData_evt(String data_evt) {
        this.data_evt = data_evt;
    }

    public String getLocal_evt() {
        return local_evt;
    }

    public void setLocal_evt(String local_evt) {
        this.local_evt = local_evt;
    }

    public Double getCache() {
        return cache;
    }

    public void setCache(Double cache) {
        this.cache = cache;
    }

    public String getSit() {
        return sit;
    }

    public void setSit(String sit) {
        this.sit = sit;
    }
}
