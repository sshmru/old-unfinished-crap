package war;

import javax.servlet.annotation.WebServlet;

import java.util.ArrayList;
import java.util.List;

import com.vaadin.annotations.Push;
import com.vaadin.annotations.Title;

import com.vaadin.annotations.Theme;
import com.vaadin.annotations.VaadinServletConfiguration;
import com.vaadin.server.VaadinRequest;
import com.vaadin.server.VaadinServlet;
import com.vaadin.ui.Button;
import com.vaadin.ui.Button.ClickEvent;
import com.vaadin.ui.Button.ClickListener;
import com.vaadin.ui.UI;

import com.vaadin.ui.AbstractField;
import com.vaadin.data.validator.StringLengthValidator;
import com.vaadin.data.util.BeanItem;
import com.vaadin.data.util.BeanItemContainer;
import com.vaadin.data.util.IndexedContainer;
import com.vaadin.data.Property;
import com.vaadin.data.Property.ValueChangeEvent;
import com.vaadin.ui.Label;
import com.vaadin.data.fieldgroup.FieldGroup;
import com.vaadin.data.fieldgroup.FieldGroup.CommitException;
import com.vaadin.ui.Field;
import com.vaadin.ui.FormLayout;
import com.vaadin.ui.VerticalLayout;
import com.vaadin.ui.HorizontalLayout;
import com.vaadin.ui.HorizontalSplitPanel;
import com.vaadin.ui.Table;
import com.vaadin.ui.TextField;
import com.vaadin.ui.Notification;

@Title("Notes")
@Theme("mytheme")
@SuppressWarnings("serial")
@Push
public class MyVaadinUI extends UI implements Broadcaster.BroadcastListener {

    private static final long serialVersionUID = 1L;
    @WebServlet(value = "/*", asyncSupported = true)
        @VaadinServletConfiguration(productionMode = false, ui = MyVaadinUI.class, widgetset = "war.AppWidgetSet")
        public static class Servlet extends VaadinServlet {
        }
    BeanItemContainer<Note> noteContainer;
Note newNote;

    private Table noteList = new Table();
    private TextField searchField = new TextField();
    private Button addNewContactButton = new Button("New");
    private Button editNoteButton = new Button("Edit Note");
    private Button deleteNoteButton= new Button("Delete Note");
    private Button saveNoteButton = new Button("Save");
    private FormLayout editorLayout = new FormLayout();
    private FormLayout viewLayout = new FormLayout();
    private FieldGroup editorFields;

    @Override
    protected void init(VaadinRequest request) {
        noteContainer = new BeanItemContainer<Note>(Note.class);
        noteContainer.addBean(new Note("Note1", "Pierwsza notatka"));
        noteContainer.addBean(new Note("Note2", "Druga notatka"));


        initLayout();
        initNoteList();
        initView();
        initEditor();
        initButtons();
        Broadcaster.register(this);
    }

    private void initLayout() {

        HorizontalSplitPanel splitPanel = new HorizontalSplitPanel();
        setContent(splitPanel);

        VerticalLayout leftLayout = new VerticalLayout();

        splitPanel.addComponent(leftLayout);
        VerticalLayout contentLayout = new VerticalLayout();
        splitPanel.addComponent(contentLayout);
        contentLayout.addComponent(editorLayout);
        contentLayout.addComponent(viewLayout);
        HorizontalLayout topLeftLayout = new HorizontalLayout();
        leftLayout.addComponent(topLeftLayout);
        topLeftLayout.addComponent(searchField);
        topLeftLayout.addComponent(addNewContactButton);
        HorizontalLayout bottomLeftLayout = new HorizontalLayout();
        leftLayout.addComponent(bottomLeftLayout);
        bottomLeftLayout.addComponent(noteList);

        leftLayout.setWidth("100%");
        topLeftLayout.setWidth("100%");
        searchField.setWidth("100%");

        topLeftLayout.setSizeFull();
        bottomLeftLayout.setSizeFull();
        noteList.setSizeFull();

        viewLayout.setMargin(true);
        viewLayout.setVisible(false);
        editorLayout.setMargin(true);
        editorLayout.setVisible(false);
    }

    private void initNoteList() {
        noteList.setContainerDataSource(noteContainer);
        noteList.setSelectable(true);
        noteList.setImmediate(true);
        noteList.setVisibleColumns(new Object[] {"name"});

        noteList.addValueChangeListener(new Property.ValueChangeListener() {
            public void valueChange(ValueChangeEvent event) {
                Note note = (Note) noteList.getValue();
                if (note != null){
                    BeanItem<Note> newNote = new BeanItem<Note>(note);
                    editorFields.setItemDataSource(newNote);

                    editorLayout.setVisible(note == null);
                    viewLayout.setVisible(note != null);
                }

            }
        });
    }

    private void initView() {


        viewLayout.addComponent(deleteNoteButton);
        viewLayout.addComponent(editNoteButton);

    }

    private void initEditor() {
        Note note = new Note("tytul", "tresc");
        BeanItem<Note> noteBean = new BeanItem<Note>(note);
        editorFields = new FieldGroup(noteBean);

        editorFields.setItemDataSource(noteBean); 
        editorFields.setBuffered(true);        
        Field nameField = editorFields.buildAndBind("Name", "name");
        nameField.setRequired(true);
        nameField.addValidator(new StringLengthValidator("1-1000 chars", 1, 1000, false));   
        editorLayout.addComponent(nameField);
        Field contentField = editorFields.buildAndBind("Content", "content");
        contentField.setRequired(true);
        contentField.addValidator(new StringLengthValidator("1-1000 chars", 1, 1000, false));   
        editorLayout.addComponent(contentField);

        saveNoteButton.addClickListener(new ClickListener() {
            public void buttonClick(ClickEvent event) {
                try {
                    editorFields.commit();
                    editorLayout.setVisible(false);
                } catch(CommitException e){
                }
            }
        });
        editorLayout.addComponent(saveNoteButton);
    }

    private void initButtons() {
	
        addNewContactButton.addClickListener(new ClickListener() {
            public void buttonClick(ClickEvent event) {
                editorLayout.setVisible(true);
                viewLayout.setVisible(false);

                newNote = new Note("tytul", "tresc");
                BeanItem<Note> noteBean = new BeanItem<Note>(newNote);
                editorFields.setItemDataSource(noteBean); 

            }

        });
        saveNoteButton.addClickListener(new ClickListener() {
            public void buttonClick(ClickEvent event) {
                noteContainer.addBean(newNote);
                editorLayout.setVisible(false);
                Broadcaster.broadcast(newNote);
		Notification.show("wysylanie", newNote.getName(), Notification.Type.WARNING_MESSAGE);
            }
        });
        editNoteButton.addClickListener(new ClickListener() {
            public void buttonClick(ClickEvent event) {
                Object noteId = noteList.getValue();
                editorFields.setItemDataSource(noteList
                    .getItem(noteId));
                editorLayout.setVisible(true);
                viewLayout.setVisible(false);
            }
        });
        deleteNoteButton.addClickListener(new ClickListener() {
            @Override
            public void buttonClick(ClickEvent event) {
                Object noteId = noteList.getValue();
                noteContainer.removeItem(noteId);
            }
        });
    }
    @Override
    public void detach() {
        Broadcaster.unregister(this);
        super.detach();
    }
    @Override
    public void receiveBroadcast(final Note note) {
        access(new Runnable(){

            @Override
            public void run() {
Notification.show("odebrano", "dziala!", Notification.Type.WARNING_MESSAGE);
                noteContainer.addBean(note);
			
            }

        });
    }
}
