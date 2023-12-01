package com.afrikatek.studentmanagement.service.impl;

import com.afrikatek.studentmanagement.domain.Province;
import com.afrikatek.studentmanagement.repository.ProvinceRepository;
import com.afrikatek.studentmanagement.service.ProvinceService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Province}.
 */
@Service
@Transactional
public class ProvinceServiceImpl implements ProvinceService {

    private final Logger log = LoggerFactory.getLogger(ProvinceServiceImpl.class);

    private final ProvinceRepository provinceRepository;

    public ProvinceServiceImpl(ProvinceRepository provinceRepository) {
        this.provinceRepository = provinceRepository;
    }

    @Override
    public Province save(Province province) {
        log.debug("Request to save Province : {}", province);
        return provinceRepository.save(province);
    }

    @Override
    public Province update(Province province) {
        log.debug("Request to update Province : {}", province);
        return provinceRepository.save(province);
    }

    @Override
    public Optional<Province> partialUpdate(Province province) {
        log.debug("Request to partially update Province : {}", province);

        return provinceRepository
            .findById(province.getId())
            .map(existingProvince -> {
                if (province.getProvinceName() != null) {
                    existingProvince.setProvinceName(province.getProvinceName());
                }

                return existingProvince;
            })
            .map(provinceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Province> findAll(Pageable pageable) {
        log.debug("Request to get all Provinces");
        return provinceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Province> findOne(Long id) {
        log.debug("Request to get Province : {}", id);
        return provinceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Province : {}", id);
        provinceRepository.deleteById(id);
    }
}
