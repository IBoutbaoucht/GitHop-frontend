// components/MermaidDiagram.jsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: '#0d1117', // GitHub Dark Background
    edgeLabelBackground: '#ffffff',
    tertiaryColor: '#238636', // GitHub Green
    lineColor: '#58a6ff' // GitHub Blue
  }
});

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid" ref={ref}>
      {chart}
    </div>
  );
};

export default MermaidDiagram;