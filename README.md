# wisq Quantum Circuit Visualizer

This project is a visualizer for the [wisq](https://github.com/qqq-wisc/wisq/tree/main?tab=readme-ov-file) quantum QASM compiler. Please check out the [gh-pages](https://qqq-wisc.github.io/wisq-visualizer/) if you want to use it in action!

## Most recently added

- Show control and target qubits through a colored border
- Added more preset circuits and now the website saves uploaded files until you reload
- Added more tests

## Issues with the current implementation

- Haven't tested it on gigantic circuits
- Looks slightly weird on different screen sizes
- When there are many paths it can be hard to distinguish

## Ideas for future additions

- Add a circuit view using latex and qcircuit
- Highlight QASM in a file at the step.
  - I could have a code view to the side which shows the QASM code, and then highlight the rows based on the current pathing shown.
  - I would need the compiler to include unitary operations in the output instead of just 2-qubit operations.
- Show a graph as well as a grid view.
- Could this become something like a VS-Code extension instead of a website?
  - Someone installs the package or extension, then it hot reloads whenever they save their QASM file.
  - Runs on the user's local host, i.e. jupyter notebook.
