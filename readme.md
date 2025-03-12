# Modern Kanban Board

A sleek, responsive Kanban board application with smooth animations, drag-and-drop functionality, and local storage persistence.

## Features

- **Three-Column Layout**: Organize tasks in "To Do", "In Progress", and "Completed" columns
- **Drag and Drop**: Easily move tasks between columns
- **Animations**: Smooth transitions and visual feedback for all interactions
- **Local Storage**: Tasks persist between browser sessions
- **Context Menu**: Right-click on tasks to edit or delete them
- **Mobile Responsive**: Works on all screen sizes
- **Visual Feedback**: Color-coded columns and tasks with hover effects
- **Task Timestamps**: Automatic date and time recording for each task

## Getting Started

### Prerequisites

No special prerequisites are needed. This application runs in any modern web browser.

### Installation

1. Clone this repository or download the source files
   ```
   git clone https://github.com/ansh0330/modern-kanban-board.git
   ```

2. Open `index.html` in your preferred web browser

## Usage

### Adding Tasks

1. Type your task in the input field at the bottom of any column
2. Click the "Add Task" button or press Enter
3. The task will appear in the selected column with the current timestamp

### Moving Tasks

1. Click and hold on a task
2. Drag it to another column
3. Release to drop the task in its new location

### Editing Tasks

1. Right-click on a task
2. Select "Edit Task" from the context menu
3. Enter the new task text in the prompt
4. The task will update with the new text and a current timestamp

### Deleting Tasks

1. Right-click on a task
2. Select "Delete Task" from the context menu
3. The task will be removed with a fade-out animation

## Technical Details

### File Structure

- `index.html` - Main HTML structure
- `style.css` - Styling with CSS variables for theming
- `script.js` - JavaScript functionality

### Key Technologies

- **Vanilla JavaScript**: No dependencies or frameworks required
- **CSS3**: Modern styling with variables, transitions, and animations
- **HTML5 Drag and Drop API**: Native drag and drop functionality
- **Local Storage API**: Browser-based data persistence

### Animation Effects

- Column entrance animations on page load
- Card creation and deletion animations
- Drag and drop visual feedback
- Task count updates with scaling effect
- Input validation shake effect
- Right-click context menu with fade effects

## Customization

### Color Scheme

The application uses CSS variables for easy theming. Open `style.css` and modify the `:root` variables:

```css
:root {
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  --column-gradient: linear-gradient(160deg, #1e293b 0%, #0f172a 100%);
  --card-gradient: linear-gradient(135deg, #334155 0%, #293548 100%);
  --primary: #a855f7; /* Purple */
  --primary-dark: #9333ea;
  --accent: #2dd4bf; /* Teal */
  
  /* Column-specific colors */
  --todo-color: #ec4899; /* Pink */
  --doing-color: #eab308; /* Yellow */
  --done-color: #22c55e; /* Green */
  
  /* Additional customizable variables below */
}
```

## Acknowledgments

- Font: [Montserrat](https://fonts.google.com/specimen/Montserrat) from Google Fonts
- Color palette inspired by modern design systems