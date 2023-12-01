package com.afrikatek.studentmanagement.repository;

import com.afrikatek.studentmanagement.domain.Educator;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Educator entity.
 *
 * When extending this class, extend EducatorRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface EducatorRepository extends EducatorRepositoryWithBagRelationships, JpaRepository<Educator, Long> {
    default Optional<Educator> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Educator> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Educator> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct educator from Educator educator left join fetch educator.user",
        countQuery = "select count(distinct educator) from Educator educator"
    )
    Page<Educator> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct educator from Educator educator left join fetch educator.user")
    List<Educator> findAllWithToOneRelationships();

    @Query("select educator from Educator educator left join fetch educator.user where educator.id =:id")
    Optional<Educator> findOneWithToOneRelationships(@Param("id") Long id);
}
