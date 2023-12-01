package com.afrikatek.studentmanagement.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.afrikatek.studentmanagement.IntegrationTest;
import com.afrikatek.studentmanagement.domain.Educator;
import com.afrikatek.studentmanagement.domain.User;
import com.afrikatek.studentmanagement.domain.enumeration.Gender;
import com.afrikatek.studentmanagement.repository.EducatorRepository;
import com.afrikatek.studentmanagement.service.EducatorService;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link EducatorResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class EducatorResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final Gender DEFAULT_GENDER = Gender.MALE;
    private static final Gender UPDATED_GENDER = Gender.FEMALE;

    private static final byte[] DEFAULT_PROFILE_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROFILE_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROFILE_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROFILE_IMAGE_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/educators";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EducatorRepository educatorRepository;

    @Mock
    private EducatorRepository educatorRepositoryMock;

    @Mock
    private EducatorService educatorServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEducatorMockMvc;

    private Educator educator;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Educator createEntity(EntityManager em) {
        Educator educator = new Educator()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .gender(DEFAULT_GENDER)
            .profileImage(DEFAULT_PROFILE_IMAGE)
            .profileImageContentType(DEFAULT_PROFILE_IMAGE_CONTENT_TYPE)
            .email(DEFAULT_EMAIL);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        educator.setUser(user);
        return educator;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Educator createUpdatedEntity(EntityManager em) {
        Educator educator = new Educator()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .profileImage(UPDATED_PROFILE_IMAGE)
            .profileImageContentType(UPDATED_PROFILE_IMAGE_CONTENT_TYPE)
            .email(UPDATED_EMAIL);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        educator.setUser(user);
        return educator;
    }

    @BeforeEach
    public void initTest() {
        educator = createEntity(em);
    }

    @Test
    @Transactional
    void createEducator() throws Exception {
        int databaseSizeBeforeCreate = educatorRepository.findAll().size();
        // Create the Educator
        restEducatorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educator)))
            .andExpect(status().isCreated());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeCreate + 1);
        Educator testEducator = educatorList.get(educatorList.size() - 1);
        assertThat(testEducator.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testEducator.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testEducator.getGender()).isEqualTo(DEFAULT_GENDER);
        assertThat(testEducator.getProfileImage()).isEqualTo(DEFAULT_PROFILE_IMAGE);
        assertThat(testEducator.getProfileImageContentType()).isEqualTo(DEFAULT_PROFILE_IMAGE_CONTENT_TYPE);
        assertThat(testEducator.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    void createEducatorWithExistingId() throws Exception {
        // Create the Educator with an existing ID
        educator.setId(1L);

        int databaseSizeBeforeCreate = educatorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEducatorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educator)))
            .andExpect(status().isBadRequest());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = educatorRepository.findAll().size();
        // set the field null
        educator.setFirstName(null);

        // Create the Educator, which fails.

        restEducatorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educator)))
            .andExpect(status().isBadRequest());

        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = educatorRepository.findAll().size();
        // set the field null
        educator.setLastName(null);

        // Create the Educator, which fails.

        restEducatorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educator)))
            .andExpect(status().isBadRequest());

        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkGenderIsRequired() throws Exception {
        int databaseSizeBeforeTest = educatorRepository.findAll().size();
        // set the field null
        educator.setGender(null);

        // Create the Educator, which fails.

        restEducatorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educator)))
            .andExpect(status().isBadRequest());

        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = educatorRepository.findAll().size();
        // set the field null
        educator.setEmail(null);

        // Create the Educator, which fails.

        restEducatorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educator)))
            .andExpect(status().isBadRequest());

        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEducators() throws Exception {
        // Initialize the database
        educatorRepository.saveAndFlush(educator);

        // Get all the educatorList
        restEducatorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(educator.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].gender").value(hasItem(DEFAULT_GENDER.toString())))
            .andExpect(jsonPath("$.[*].profileImageContentType").value(hasItem(DEFAULT_PROFILE_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].profileImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROFILE_IMAGE))))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEducatorsWithEagerRelationshipsIsEnabled() throws Exception {
        when(educatorServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEducatorMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(educatorServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllEducatorsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(educatorServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restEducatorMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(educatorRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getEducator() throws Exception {
        // Initialize the database
        educatorRepository.saveAndFlush(educator);

        // Get the educator
        restEducatorMockMvc
            .perform(get(ENTITY_API_URL_ID, educator.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(educator.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.gender").value(DEFAULT_GENDER.toString()))
            .andExpect(jsonPath("$.profileImageContentType").value(DEFAULT_PROFILE_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.profileImage").value(Base64Utils.encodeToString(DEFAULT_PROFILE_IMAGE)))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }

    @Test
    @Transactional
    void getNonExistingEducator() throws Exception {
        // Get the educator
        restEducatorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEducator() throws Exception {
        // Initialize the database
        educatorRepository.saveAndFlush(educator);

        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();

        // Update the educator
        Educator updatedEducator = educatorRepository.findById(educator.getId()).get();
        // Disconnect from session so that the updates on updatedEducator are not directly saved in db
        em.detach(updatedEducator);
        updatedEducator
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .profileImage(UPDATED_PROFILE_IMAGE)
            .profileImageContentType(UPDATED_PROFILE_IMAGE_CONTENT_TYPE)
            .email(UPDATED_EMAIL);

        restEducatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEducator.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEducator))
            )
            .andExpect(status().isOk());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
        Educator testEducator = educatorList.get(educatorList.size() - 1);
        assertThat(testEducator.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testEducator.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testEducator.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testEducator.getProfileImage()).isEqualTo(UPDATED_PROFILE_IMAGE);
        assertThat(testEducator.getProfileImageContentType()).isEqualTo(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);
        assertThat(testEducator.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void putNonExistingEducator() throws Exception {
        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();
        educator.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEducatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, educator.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(educator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEducator() throws Exception {
        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();
        educator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducatorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(educator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEducator() throws Exception {
        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();
        educator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducatorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educator)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEducatorWithPatch() throws Exception {
        // Initialize the database
        educatorRepository.saveAndFlush(educator);

        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();

        // Update the educator using partial update
        Educator partialUpdatedEducator = new Educator();
        partialUpdatedEducator.setId(educator.getId());

        partialUpdatedEducator
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .profileImage(UPDATED_PROFILE_IMAGE)
            .profileImageContentType(UPDATED_PROFILE_IMAGE_CONTENT_TYPE)
            .email(UPDATED_EMAIL);

        restEducatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEducator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEducator))
            )
            .andExpect(status().isOk());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
        Educator testEducator = educatorList.get(educatorList.size() - 1);
        assertThat(testEducator.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testEducator.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testEducator.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testEducator.getProfileImage()).isEqualTo(UPDATED_PROFILE_IMAGE);
        assertThat(testEducator.getProfileImageContentType()).isEqualTo(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);
        assertThat(testEducator.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void fullUpdateEducatorWithPatch() throws Exception {
        // Initialize the database
        educatorRepository.saveAndFlush(educator);

        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();

        // Update the educator using partial update
        Educator partialUpdatedEducator = new Educator();
        partialUpdatedEducator.setId(educator.getId());

        partialUpdatedEducator
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .gender(UPDATED_GENDER)
            .profileImage(UPDATED_PROFILE_IMAGE)
            .profileImageContentType(UPDATED_PROFILE_IMAGE_CONTENT_TYPE)
            .email(UPDATED_EMAIL);

        restEducatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEducator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEducator))
            )
            .andExpect(status().isOk());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
        Educator testEducator = educatorList.get(educatorList.size() - 1);
        assertThat(testEducator.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testEducator.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testEducator.getGender()).isEqualTo(UPDATED_GENDER);
        assertThat(testEducator.getProfileImage()).isEqualTo(UPDATED_PROFILE_IMAGE);
        assertThat(testEducator.getProfileImageContentType()).isEqualTo(UPDATED_PROFILE_IMAGE_CONTENT_TYPE);
        assertThat(testEducator.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    void patchNonExistingEducator() throws Exception {
        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();
        educator.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEducatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, educator.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(educator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEducator() throws Exception {
        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();
        educator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducatorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(educator))
            )
            .andExpect(status().isBadRequest());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEducator() throws Exception {
        int databaseSizeBeforeUpdate = educatorRepository.findAll().size();
        educator.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducatorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(educator)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Educator in the database
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEducator() throws Exception {
        // Initialize the database
        educatorRepository.saveAndFlush(educator);

        int databaseSizeBeforeDelete = educatorRepository.findAll().size();

        // Delete the educator
        restEducatorMockMvc
            .perform(delete(ENTITY_API_URL_ID, educator.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Educator> educatorList = educatorRepository.findAll();
        assertThat(educatorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
