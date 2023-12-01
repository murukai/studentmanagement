package com.afrikatek.studentmanagement.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.afrikatek.studentmanagement.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EducatorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Educator.class);
        Educator educator1 = new Educator();
        educator1.setId(1L);
        Educator educator2 = new Educator();
        educator2.setId(educator1.getId());
        assertThat(educator1).isEqualTo(educator2);
        educator2.setId(2L);
        assertThat(educator1).isNotEqualTo(educator2);
        educator1.setId(null);
        assertThat(educator1).isNotEqualTo(educator2);
    }
}
