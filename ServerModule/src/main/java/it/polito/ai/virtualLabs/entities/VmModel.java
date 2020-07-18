package it.polito.ai.virtualLabs.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

@Data
@Entity
public class VmModel {
    @EmbeddedId
    private VmModelKey id;

    @NotNull
    private String name;

    private int maxVCPU;
    private int maxDisk;
    private int maxRAM;
    private int maxTotVM;
    private int maxActiveVM;
}

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
class VmModelKey implements Serializable {
    protected Professor professor;
    protected Course course;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VmModelKey that = (VmModelKey) o;
        return Objects.equals(professor, that.professor) && Objects.equals(course, that.course);
    }

    @Override
    public int hashCode() {
        return Objects.hash(professor, course);
    }
}
