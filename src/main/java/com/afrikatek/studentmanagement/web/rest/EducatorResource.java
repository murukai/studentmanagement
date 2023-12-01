package com.afrikatek.studentmanagement.web.rest;

import com.afrikatek.studentmanagement.domain.Educator;
import com.afrikatek.studentmanagement.repository.EducatorRepository;
import com.afrikatek.studentmanagement.service.EducatorService;
import com.afrikatek.studentmanagement.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.afrikatek.studentmanagement.domain.Educator}.
 */
@RestController
@RequestMapping("/api")
public class EducatorResource {

    private final Logger log = LoggerFactory.getLogger(EducatorResource.class);

    private static final String ENTITY_NAME = "educator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EducatorService educatorService;

    private final EducatorRepository educatorRepository;

    public EducatorResource(EducatorService educatorService, EducatorRepository educatorRepository) {
        this.educatorService = educatorService;
        this.educatorRepository = educatorRepository;
    }

    /**
     * {@code POST  /educators} : Create a new educator.
     *
     * @param educator the educator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new educator, or with status {@code 400 (Bad Request)} if the educator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/educators")
    public ResponseEntity<Educator> createEducator(@Valid @RequestBody Educator educator) throws URISyntaxException {
        log.debug("REST request to save Educator : {}", educator);
        if (educator.getId() != null) {
            throw new BadRequestAlertException("A new educator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Educator result = educatorService.save(educator);
        return ResponseEntity
            .created(new URI("/api/educators/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /educators/:id} : Updates an existing educator.
     *
     * @param id the id of the educator to save.
     * @param educator the educator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated educator,
     * or with status {@code 400 (Bad Request)} if the educator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the educator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/educators/{id}")
    public ResponseEntity<Educator> updateEducator(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Educator educator
    ) throws URISyntaxException {
        log.debug("REST request to update Educator : {}, {}", id, educator);
        if (educator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, educator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!educatorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Educator result = educatorService.update(educator);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, educator.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /educators/:id} : Partial updates given fields of an existing educator, field will ignore if it is null
     *
     * @param id the id of the educator to save.
     * @param educator the educator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated educator,
     * or with status {@code 400 (Bad Request)} if the educator is not valid,
     * or with status {@code 404 (Not Found)} if the educator is not found,
     * or with status {@code 500 (Internal Server Error)} if the educator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/educators/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Educator> partialUpdateEducator(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Educator educator
    ) throws URISyntaxException {
        log.debug("REST request to partial update Educator partially : {}, {}", id, educator);
        if (educator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, educator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!educatorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Educator> result = educatorService.partialUpdate(educator);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, educator.getId().toString())
        );
    }

    /**
     * {@code GET  /educators} : get all the educators.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of educators in body.
     */
    @GetMapping("/educators")
    public ResponseEntity<List<Educator>> getAllEducators(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get a page of Educators");
        Page<Educator> page;
        if (eagerload) {
            page = educatorService.findAllWithEagerRelationships(pageable);
        } else {
            page = educatorService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /educators/:id} : get the "id" educator.
     *
     * @param id the id of the educator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the educator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/educators/{id}")
    public ResponseEntity<Educator> getEducator(@PathVariable Long id) {
        log.debug("REST request to get Educator : {}", id);
        Optional<Educator> educator = educatorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(educator);
    }

    /**
     * {@code DELETE  /educators/:id} : delete the "id" educator.
     *
     * @param id the id of the educator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/educators/{id}")
    public ResponseEntity<Void> deleteEducator(@PathVariable Long id) {
        log.debug("REST request to delete Educator : {}", id);
        educatorService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
