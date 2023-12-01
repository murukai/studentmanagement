package com.afrikatek.studentmanagement.service.impl;

import com.afrikatek.studentmanagement.domain.Educator;
import com.afrikatek.studentmanagement.repository.EducatorRepository;
import com.afrikatek.studentmanagement.service.EducatorService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Educator}.
 */
@Service
@Transactional
public class EducatorServiceImpl implements EducatorService {

    private final Logger log = LoggerFactory.getLogger(EducatorServiceImpl.class);

    private final EducatorRepository educatorRepository;

    public EducatorServiceImpl(EducatorRepository educatorRepository) {
        this.educatorRepository = educatorRepository;
    }

    @Override
    public Educator save(Educator educator) {
        log.debug("Request to save Educator : {}", educator);
        return educatorRepository.save(educator);
    }

    @Override
    public Educator update(Educator educator) {
        log.debug("Request to update Educator : {}", educator);
        return educatorRepository.save(educator);
    }

    @Override
    public Optional<Educator> partialUpdate(Educator educator) {
        log.debug("Request to partially update Educator : {}", educator);

        return educatorRepository
            .findById(educator.getId())
            .map(existingEducator -> {
                if (educator.getFirstName() != null) {
                    existingEducator.setFirstName(educator.getFirstName());
                }
                if (educator.getLastName() != null) {
                    existingEducator.setLastName(educator.getLastName());
                }
                if (educator.getGender() != null) {
                    existingEducator.setGender(educator.getGender());
                }
                if (educator.getProfileImage() != null) {
                    existingEducator.setProfileImage(educator.getProfileImage());
                }
                if (educator.getProfileImageContentType() != null) {
                    existingEducator.setProfileImageContentType(educator.getProfileImageContentType());
                }
                if (educator.getEmail() != null) {
                    existingEducator.setEmail(educator.getEmail());
                }

                return existingEducator;
            })
            .map(educatorRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Educator> findAll(Pageable pageable) {
        log.debug("Request to get all Educators");
        return educatorRepository.findAll(pageable);
    }

    public Page<Educator> findAllWithEagerRelationships(Pageable pageable) {
        return educatorRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Educator> findOne(Long id) {
        log.debug("Request to get Educator : {}", id);
        return educatorRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Educator : {}", id);
        educatorRepository.deleteById(id);
    }
}
