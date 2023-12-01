package com.afrikatek.studentmanagement.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.afrikatek.studentmanagement.IntegrationTest;
import com.afrikatek.studentmanagement.domain.Guardian;
import com.afrikatek.studentmanagement.domain.enumeration.Gender;
import com.afrikatek.studentmanagement.repository.GuardianRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GuardianResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GuardianResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final Gender DEFAULT_GENDER = Gender.MALE;
    private static final Gender UPDATED_GENDER = Gender.FEMALE;

    private static final String DEFAULT_PROFESSION = "AAAAAAAAAA";
    private static final String UPDATED_PROFESSION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/guardians";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GuardianRepository guardianRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGuardianMockMvc;

    private Guardian guardian;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Guardian createEntity(EntityManager em) {
        Guardian guardian = new Guardian()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .gender(DEFAULT_GENDER)
            .profession(DEFAULT_PROFESSION);
        return guardian;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Guardian createUpdatedEntity(EntityManager em) {
        Guardian guardian = new Guardian()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .profession(UPDATED_PROFESSION);
        return guardian;
    }

    @BeforeEach
    public void initTest() {
        guardian = createEntity(em);
    }

    @Test
    @Transactional
    void createGuardian() throws Exception {
        int databaseSizeBeforeCreate = guardianRepository.findAll().size();
        // Create the Guardian
        restGuardianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guardian)))
            .andExpect(status().isCreated());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeCreate + 1);
        Guardian testGuardian = guardianList.get(guardianList.size() - 1);
        assertThat(testGuardian.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testGuardian.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testGuardian.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testGuardian.getProfession()).isEqualTo(DEFAULT_PROFESSION);
    }

    @Test
    @Transactional
    void createGuardianWithExistingId() throws Exception {
        // Create the Guardian with an existing ID
        guardian.setId(1L);

        int databaseSizeBeforeCreate = guardianRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGuardianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guardian)))
            .andExpect(status().isBadRequest());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = guardianRepository.findAll().size();
        // set the field null
        guardian.setFirstName(null);

        // Create the Guardian, which fails.

        restGuardianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guardian)))
            .andExpect(status().isBadRequest());

        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = guardianRepository.findAll().size();
        // set the field null
        guardian.setLastName(null);

        // Create the Guardian, which fails.

        restGuardianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guardian)))
            .andExpect(status().isBadRequest());

        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGenderIsRequired() throws Exception {
        int databaseSizeBeforeTest = guardianRepository.findAll().size();
        // set the field null
        guardian.setGender(null);

        // Create the Guardian, which fails.

        restGuardianMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guardian)))
            .andExpect(status().isBadRequest());

        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGuardians() throws Exception {
        // Initialize the database
        guardianRepository.saveAndFlush(guardian);

        // Get all the guardianList
        restGuardianMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(guardian.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER.toString())))
            .andExpect(jsonPath("$.[*].profession").value(hasItem(DEFAULT_PROFESSION)));
    }

    @Test
    @Transactional
    void getGuardian() throws Exception {
        // Initialize the database
        guardianRepository.saveAndFlush(guardian);

        // Get the guardian
        restGuardianMockMvc
            .perform(get(ENTITY_API_URL_ID, guardian.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(guardian.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER.toString()))
            .andExpect(jsonPath("$.profession").value(DEFAULT_PROFESSION));
    }

    @Test
    @Transactional
    void getNonExistingGuardian() throws Exception {
        // Get the guardian
        restGuardianMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGuardian() throws Exception {
        // Initialize the database
        guardianRepository.saveAndFlush(guardian);

        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();

        // Update the guardian
        Guardian updatedGuardian = guardianRepository.findById(guardian.getId()).get();
        // Disconnect from session so that the updates on updatedGuardian are not directly saved in db
        em.detach(updatedGuardian);
        updatedGuardian.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME).gender(UPDATED_GENDER).profession(UPDATED_PROFESSION);

        restGuardianMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGuardian.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGuardian))
            )
            .andExpect(status().isOk());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
        Guardian testGuardian = guardianList.get(guardianList.size() - 1);
        assertThat(testGuardian.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testGuardian.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testGuardian.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testGuardian.getProfession()).isEqualTo(UPDATED_PROFESSION);
    }

    @Test
    @Transactional
    void putNonExistingGuardian() throws Exception {
        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();
        guardian.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGuardianMockMvc
            .perform(
                put(ENTITY_API_URL_ID, guardian.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(guardian))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGuardian() throws Exception {
        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();
        guardian.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuardianMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(guardian))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGuardian() throws Exception {
        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();
        guardian.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuardianMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(guardian)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGuardianWithPatch() throws Exception {
        // Initialize the database
        guardianRepository.saveAndFlush(guardian);

        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();

        // Update the guardian using partial update
        Guardian partialUpdatedGuardian = new Guardian();
        partialUpdatedGuardian.setId(guardian.getId());

        partialUpdatedGuardian.gender(UPDATED_GENDER).profession(UPDATED_PROFESSION);

        restGuardianMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGuardian.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGuardian))
            )
            .andExpect(status().isOk());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
        Guardian testGuardian = guardianList.get(guardianList.size() - 1);
        assertThat(testGuardian.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testGuardian.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testGuardian.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testGuardian.getProfession()).isEqualTo(UPDATED_PROFESSION);
    }

    @Test
    @Transactional
    void fullUpdateGuardianWithPatch() throws Exception {
        // Initialize the database
        guardianRepository.saveAndFlush(guardian);

        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();

        // Update the guardian using partial update
        Guardian partialUpdatedGuardian = new Guardian();
        partialUpdatedGuardian.setId(guardian.getId());

        partialUpdatedGuardian
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .profession(UPDATED_PROFESSION);

        restGuardianMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGuardian.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGuardian))
            )
            .andExpect(status().isOk());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
        Guardian testGuardian = guardianList.get(guardianList.size() - 1);
        assertThat(testGuardian.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testGuardian.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testGuardian.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testGuardian.getProfession()).isEqualTo(UPDATED_PROFESSION);
    }

    @Test
    @Transactional
    void patchNonExistingGuardian() throws Exception {
        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();
        guardian.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGuardianMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, guardian.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(guardian))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGuardian() throws Exception {
        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();
        guardian.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuardianMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(guardian))
            )
            .andExpect(status().isBadRequest());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGuardian() throws Exception {
        int databaseSizeBeforeUpdate = guardianRepository.findAll().size();
        guardian.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGuardianMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(guardian)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Guardian in the database
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGuardian() throws Exception {
        // Initialize the database
        guardianRepository.saveAndFlush(guardian);

        int databaseSizeBeforeDelete = guardianRepository.findAll().size();

        // Delete the guardian
        restGuardianMockMvc
            .perform(delete(ENTITY_API_URL_ID, guardian.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Guardian> guardianList = guardianRepository.findAll();
        assertThat(guardianList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
