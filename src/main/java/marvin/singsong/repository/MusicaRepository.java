package marvin.singsong.repository;

import marvin.singsong.model.BlocoModel;
import marvin.singsong.model.MusicaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface MusicaRepository extends JpaRepository<MusicaModel,Integer> {

    @Query(value = "SELECT * FROM musica_model as a where a.id_bloco=:id_bloco order by a.musica", nativeQuery = true)
    List<MusicaModel> pegar_musicas_bloco(@Param("id_bloco")Integer id_bloco);

    @Query(value = "SELECT * FROM musica_model as a where a.id =:id", nativeQuery = true)
    MusicaModel pegar_musica_id(@Param("id")Integer id);
}
