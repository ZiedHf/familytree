import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import nodeDataArray from "./familyData";
import { Person, Gender } from "./types";

function initDiagram() {
  var $ = go.GraphObject.make; // for conciseness in defining templates

  const myDiagram = $(go.Diagram, {
    "toolManager.hoverDelay": 100, // 100 milliseconds instead of the default 850
    allowCopy: false,
    // create a TreeLayout for the family tree
    layout: $(go.TreeLayout, {
      angle: 90,
      nodeSpacing: 10,
      layerSpacing: 40,
      layerStyle: go.TreeLayout.LayerUniform,
    }),
  });

  var blueGrad = "#90CAF9";
  var pinkGrad = "#F48FB1";

  // get tooltip text from the object's data
  function tooltipTextConverter(person: Person) {
    var str = "";
    if (person.name !== undefined) str += "الاسم: " + person.name;
    // if (person.key !== undefined) str += "\nالرمز: " + person.key;
    if (person.birthYear !== undefined)
      str += "\nولد سنة : " + person.birthYear;
    if (person.deathYear !== undefined)
      str += "\nتوفي سنة : " + person.deathYear;
    if (person.partner !== undefined) str += "\nشريك: " + person.partner;
    if (person.description !== undefined) str += "\nوصف: " + person.description;
    return str;
  }

  // define tooltips for nodes
  var tooltipTemplate = $(
    "ToolTip",
    { "Border.fill": "whitesmoke", "Border.stroke": "black" },
    $(
      go.TextBlock,
      {
        font: "bold 8pt Helvetica, bold Arial, sans-serif",
        wrap: go.TextBlock.WrapFit,
        margin: 5,
      },
      new go.Binding("text", "", tooltipTextConverter)
    )
  );

  // define Converters to be used for Bindings
  function genderBrushConverter(gender: Gender) {
    if (gender === Gender.M) return blueGrad;
    if (gender === Gender.F) return pinkGrad;
    return "orange";
  }

  // replace the default Node template in the nodeTemplateMap
  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    { deletable: false, toolTip: tooltipTemplate },
    new go.Binding("text", "name"),
    $(
      go.Shape,
      "Rectangle",
      {
        fill: "lightgray",
        stroke: null,
        strokeWidth: 0,
        stretch: go.GraphObject.Fill,
        alignment: go.Spot.Center,
      },
      new go.Binding("fill", "gender", genderBrushConverter)
    ),
    $(
      go.TextBlock,
      {
        font: "700 12px Droid Serif, sans-serif",
        textAlign: "center",
        margin: 10,
        maxSize: new go.Size(80, NaN),
      },
      new go.Binding("text", "name")
    )
  );

  // define the Link template
  myDiagram.linkTemplate = $(
    go.Link, // the whole link panel
    { routing: go.Link.Orthogonal, corner: 5, selectable: false },
    $(go.Shape, { strokeWidth: 3, stroke: "#424242" })
  ); // the gray link shape

  // create the model for the family tree
  myDiagram.model = new go.TreeModel(nodeDataArray);

  // Scroll to the main root tree
  myDiagram.addDiagramListener("InitialLayoutCompleted", () => {
    myDiagram.scrollToRect(
      (myDiagram.findNodeForKey(0) as go.Node).actualBounds
    );
  });

  return myDiagram;
}

function Diagram() {
  return (
    <ReactDiagram
      initDiagram={initDiagram}
      divClassName="diagram-component"
      nodeDataArray={nodeDataArray}
      skipsDiagramUpdate
    />
  );
}

export default Diagram;
