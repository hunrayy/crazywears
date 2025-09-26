import ClassicEditor from "@ckeditor/ckeditor5-build-classic"; // Use the default ClassicEditor build

// Export custom build
export default class CustomEditor extends ClassicEditor {}

CustomEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading', '|',
      'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
      'alignment', '|',
      'undo', 'redo'
    ]
  },
  alignment: {
    options: ['left', 'center', 'right', 'justify']
  },
  language: 'en'
};
