# wisq Quantum Circuit Visualizer

This project is a visualizer for the [wisq](https://github.com/qqq-wisc/wisq/tree/main?tab=readme-ov-file) quantum QASM compiler. Please checkout the [gh-pages](https://qqq-wisc.github.io/wisq-visualizer/) if you want to use it in action!

## Most recently added

- Gave tdg gates a distinct pale yellow color to destinguish them from the dark yellow of t gates.
- Only show the qubits used in each step instead of all qubits in the mapping.
- Show the control and target qubits by using an explicit identifier on the edge tiles: C<sub>2</sub> - 2 - 2 - 2 - T<sub>2</sub>.
- Added more unit tests, specifically for the TileLayoutParser.

## Issues with the current implementation

- Testers are very lacking. Although the code is working, it would be good to make some more tests.
- It has only been used on two circuits. I should try it using a several different circuits and architectures to iron out any problems.

## Ideas for future additions

- Highlight QASM in a file at the step.
  - I could have a code view to the side which shows the QASM code, and then highlight the rows based on the current pathing shown.
  - I would need the compiler to include unitary operations in the output instead of just 2-qubit operations.
- The way I show control and target qubits isn't extremely intuitive which qubits are connected.
  - [LSC](https://latticesurgery.com/online-compiler) does this by having 'stitches.' A flat and a serrated edge which are then connected to the path between them.
  - I could highlight edges.
  - May not even be a problem.
- Show a graph as well as a grid view.
- Could this become somethign like a vs-code extension instead of a website?
  - Someone installs the package or extension, then it hot reloads whenever they save their QASM file.
  - Runs on the users local host, i.e. jupyter notebook.
