package com.afrikatek.studentmanagement.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

/**
 * A Grade.
 */
@Entity
@Table(name = "grade")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Grade implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "description", nullable = false)
    private String description;

    @OneToMany(mappedBy = "grade")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "guardians", "grade" }, allowSetters = true)
    private Set<Student> students = new HashSet<>();

    @ManyToMany(mappedBy = "grades")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "grades" }, allowSetters = true)
    private Set<Educator> educators = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Grade id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Grade name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Grade description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Student> getStudents() {
        return this.students;
    }

    public void setStudents(Set<Student> students) {
        if (this.students != null) {
            this.students.forEach(i -> i.setGrade(null));
        }
        if (students != null) {
            students.forEach(i -> i.setGrade(this));
        }
        this.students = students;
    }

    public Grade students(Set<Student> students) {
        this.setStudents(students);
        return this;
    }

    public Grade addStudent(Student student) {
        this.students.add(student);
        student.setGrade(this);
        return this;
    }

    public Grade removeStudent(Student student) {
        this.students.remove(student);
        student.setGrade(null);
        return this;
    }

    public Set<Educator> getEducators() {
        return this.educators;
    }

    public void setEducators(Set<Educator> educators) {
        if (this.educators != null) {
            this.educators.forEach(i -> i.removeGrade(this));
        }
        if (educators != null) {
            educators.forEach(i -> i.addGrade(this));
        }
        this.educators = educators;
    }

    public Grade educators(Set<Educator> educators) {
        this.setEducators(educators);
        return this;
    }

    public Grade addEducator(Educator educator) {
        this.educators.add(educator);
        educator.getGrades().add(this);
        return this;
    }

    public Grade removeEducator(Educator educator) {
        this.educators.remove(educator);
        educator.getGrades().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Grade)) {
            return false;
        }
        return id != null && id.equals(((Grade) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Grade{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
