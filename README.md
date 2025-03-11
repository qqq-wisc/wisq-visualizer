# wisq Quantum Circuit Visualizer
This project is a visualizer for the [wisq](https://github.com/qqq-wisc/wisq/tree/main?tab=readme-ov-file) quantum QASM compiler. Please checkout the [gh-pages](https://qqq-wisc.github.io/wisq-visualizer/) if you want to use it in action!

## Issues with the current implementation
* Only cx and t gates are distinct. Tdg gates are given the same color as t gates.
* Currently all qubits in the mapping are shown at every step. I should only show the Qubits required in the step.
* Testers are very lacking. Although the code is working, it would be good to make some more tests.
* It has only been used on two circuites. I should try it using a several different circuits and architectures to iron out any problems.

## Ideas for future additions
* Highlight QASM in a file at the step.
  * I could have a code view to the side which shows the QASM code, and then highlight the rows based on the current pathing shown.
  * I would need the compiler to include unitary operations in the output instead of just 2-qubit operations.
* Show the control and target qubits in operations like cx.
  * [LSC](https://latticesurgery.com/online-compiler) does this by having 'stitches.' A flat and a serrated edge which are then connected to the path between them.
  * I could either use an explicit identifier on the edge tiles: C<sub>2</sub> - 2 - 2 - 2 - T<sub>2</sub>
  * Or I could highlight edges.
* Show a graph as well as a grid view.
* Could this become somethign like a vs-code extension instead of a website?
  * Someone installs the package or extension, then it hot reloads whenever they save their QASM file.
  * Runs on the users local host, i.e. jupyter notebook.
