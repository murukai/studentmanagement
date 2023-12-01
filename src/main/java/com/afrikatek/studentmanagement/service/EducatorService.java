package com.afrikatek.studentmanagement.service;

import com.afrikatek.studentmanagement.domain.Educator;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Educator}.
 */
public interface EducatorService {
    /**
     * Save a educator.
     *
     * @param educator the entity to save.
     * @return the persisted entity.
     */
    Educator save(Educator educator);

    /**
     * Updates a educator.
     *
     * @param educator the entity to update.
     * @return the persisted entity.
     */
    Educator update(Educator educator);

    /**
     * Partially updates a educator.
     *
     * @param educator the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Educator> partialUpdate(Educator educator);

    /**
     * Get all the educators.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Educator> findAll(Pageable pageable);

    /**
     * Get all the educators with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Educator> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" educator.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Educator> findOne(Long id);

    /**
     * Delete the "id" educator.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
