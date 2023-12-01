package com.afrikatek.studentmanagement.service.impl;

import com.afrikatek.studentmanagement.domain.Grade;
import com.afrikatek.studentmanagement.repository.GradeRepository;
import com.afrikatek.studentmanagement.service.GradeService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Grade}.
 */
@Service
@Transactional
public class GradeServiceImpl implements GradeService {

    private final Logger log = LoggerFactory.getLogger(GradeServiceImpl.class);

    private final GradeRepository gradeRepository;

    public GradeServiceImpl(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    @Override
    public Grade save(Grade grade) {
        log.debug("Request to save Grade : {}", grade);
        return gradeRepository.save(grade);
    }

    @Override
    public Grade update(Grade grade) {
        log.debug("Request to update Grade : {}", grade);
        return gradeRepository.save(grade);
    }

    @Override
    public Optional<Grade> partialUpdate(Grade grade) {
        log.debug("Request to partially update Grade : {}", grade);

        return gradeRepository
            .findById(grade.getId())
            .map(existingGrade -> {
                if (grade.getName() != null) {
                    existingGrade.setName(grade.getName());
                }
                if (grade.getDescription() != null) {
                    existingGrade.setDescription(grade.getDescription());
                }

                return existingGrade;
            })
            .map(gradeRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Grade> findAll(Pageable pageable) {
        log.debug("Request to get all Grades");
        return gradeRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Grade> findOne(Long id) {
        log.debug("Request to get Grade : {}", id);
        return gradeRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Grade : {}", id);
        gradeRepository.deleteById(id);
    }
}
