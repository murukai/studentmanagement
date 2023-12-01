package com.afrikatek.studentmanagement.repository;

import com.afrikatek.studentmanagement.domain.Educator;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class EducatorRepositoryWithBagRelationshipsImpl implements EducatorRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Educator> fetchBagRelationships(Optional<Educator> educator) {
        return educator.map(this::fetchGrades);
    }

    @Override
    public Page<Educator> fetchBagRelationships(Page<Educator> educators) {
        return new PageImpl<>(fetchBagRelationships(educators.getContent()), educators.getPageable(), educators.getTotalElements());
    }

    @Override
    public List<Educator> fetchBagRelationships(List<Educator> educators) {
        return Optional.of(educators).map(this::fetchGrades).orElse(Collections.emptyList());
    }

    Educator fetchGrades(Educator result) {
        return entityManager
            .createQuery(
                "select educator from Educator educator left join fetch educator.grades where educator is :educator",
                Educator.class
            )
            .setParameter("educator", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Educator> fetchGrades(List<Educator> educators) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, educators.size()).forEach(index -> order.put(educators.get(index).getId(), index));
        List<Educator> result = entityManager
            .createQuery(
                "select distinct educator from Educator educator left join fetch educator.grades where educator in :educators",
                Educator.class
            )
            .setParameter("educators", educators)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
