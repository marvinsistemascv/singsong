package marvin.singsong.repository;


import marvin.singsong.model.BlocoModel;
import marvin.singsong.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface BlocoRepository extends JpaRepository<BlocoModel,Integer> {

    @Query(value = "SELECT * FROM bloco_model as a order by a.bloco", nativeQuery = true)
    List<BlocoModel> pegar_blocos();
}
