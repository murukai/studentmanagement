package com.afrikatek.studentmanagement.repository;

import com.afrikatek.studentmanagement.domain.Educator;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface EducatorRepositoryWithBagRelationships {
    Optional<Educator> fetchBagRelationships(Optional<Educator> educator);

    List<Educator> fetchBagRelationships(List<Educator> educators);

    Page<Educator> fetchBagRelationships(Page<Educator> educators);
}
