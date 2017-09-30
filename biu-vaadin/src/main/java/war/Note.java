package war;

import java.io.Serializable;

public class Note implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String name;
    private String content;

    public Note(){}


    public Note(String name, String content){
        super();
        this.name = name;
        this.content = content;
    }


    public Note(Long id, String name, String category, String content){
        super();
        this.id = id;
        this.name = name;
        this.content = content;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getcontent() {
        return content;
    }
    public void setContent(String setContent) {
        this.content = content;
    }
}
