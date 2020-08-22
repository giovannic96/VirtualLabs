package it.polito.ai.virtualLabs.entities;

import lombok.Data;
import org.modelmapper.Converters;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.*;

@Data
@Entity
public class VmModel {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;
    private String os;

    private int maxVCPU;
    private int maxDisk;
    private int maxRAM;
    private int maxTotVm;
    private int maxActiveVm;

    private static final Map<String, String> osMap;
    static {
        Map<String, String> map = new HashMap<>();
        map.put("win_10", "Windows 10");
        map.put("ubuntu_20_4", "Ubuntu 20.04");
        map.put("debian_buster", "Debian buster");
        map.put("kali_linux", "Kali Linux");
        map.put("macos_cheetah_10", "Mac OS X Cheetah 10.0");
        osMap = Collections.unmodifiableMap(map);
    }

    @OneToOne
    @JoinColumn(name = "course_name")
    private Course course;

    @OneToMany(mappedBy = "vmModel", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Vm> vms = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Professor professor;

    public static Map<String, String> getOsMap() {
        return osMap;
    }

    public void setProfessor(Professor p) {
        if(professor != null)
            professor.getVmModels().remove(this);
        if(p != null)
            p.getVmModels().add(this);
        professor = p;
    }

    public void setCourse(Course c) {
        if(course != null)
            course.setVmModel(null);
        if(c != null)
            c.setVmModel(this);
        course = c;
    }
}
