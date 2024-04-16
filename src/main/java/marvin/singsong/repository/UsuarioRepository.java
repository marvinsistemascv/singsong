package marvin.singsong.repository;

import marvin.singsong.model.UsuarioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface UsuarioRepository extends JpaRepository<UsuarioModel, Integer> {

    @Query(value = "SELECT * FROM usuario_model as a where a.email =:email and a.senha =:senha and a.sit ='Ativo'", nativeQuery = true)
    UsuarioModel checarLogin(@Param("email") String email, @Param("senha") String senha);

    @Query(value = "SELECT * FROM usuario_model as a where a.nome = 'userpadrão'", nativeQuery = true)
    UsuarioModel checarLoginPadrao();

    @Query(value = "SELECT * FROM usuario_model as a where a.email =:email and a.sit ='Ativo'", nativeQuery = true)
    UsuarioModel pegarUsuariosEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM usuario_model as a where a.id =:id", nativeQuery = true)
    UsuarioModel pegarUsuariosId(@Param("id") Integer id);

    @Query(value = "SELECT * FROM usuario_model as a order by a.nome", nativeQuery = true)
    List<UsuarioModel> pegar_todos_usuarios();

}
