export async function submitPipeline(nodes, edges) {
  const response = await fetch('http://localhost:8000/pipelines/parse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nodes, edges }),
  });

  if (!response.ok) {
    throw new Error(`Failed to parse pipeline: ${response.status}`);
  }

  return response.json();
}