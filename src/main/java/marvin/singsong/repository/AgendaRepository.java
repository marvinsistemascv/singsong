package marvin.singsong.repository;


import marvin.singsong.model.AgendaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface AgendaRepository extends JpaRepository<AgendaModel,Integer> {

    @Query(value = "SELECT * FROM agenda_model as a ", nativeQuery = true)
    List<AgendaModel> pegar_agendamentos();

    @Query(value = "SELECT * FROM agenda_model as a where a.id =:id", nativeQuery = true)
    AgendaModel pegar_agenda_id(@Param("id")Integer id);


    @Transactional
    @Query(value = "SELECT sum(a.cache)as recebido FROM agenda_model as a where a.sit ='finalizado'", nativeQuery = true)
    Double pegar_valores_recebidos();

    @Transactional
    @Query(value = "SELECT sum(a.cache)as recebido FROM agenda_model as a where a.sit ='agendado'", nativeQuery = true)
    Double pegar_valores_receber();
}
