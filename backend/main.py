from collections import deque
from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


def check_is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    node_ids = [node["id"] for node in nodes]
    adjacency = {node_id: [] for node_id in node_ids}
    indegree = {node_id: 0 for node_id in node_ids}

    for edge in edges:
      source = edge.get("source")
      target = edge.get("target")

      if source in adjacency and target in indegree:
          adjacency[source].append(target)
          indegree[target] += 1

    queue = deque([node_id for node_id in node_ids if indegree[node_id] == 0])
    visited = 0

    while queue:
        current = queue.popleft()
        visited += 1

        for neighbor in adjacency[current]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


@app.get("/")
def read_root():
    return {"message": "Backend is running"}


@app.post("/pipelines/parse")
def parse_pipeline(payload: PipelinePayload):
    return {
        "num_nodes": len(payload.nodes),
        "num_edges": len(payload.edges),
        "is_dag": check_is_dag(payload.nodes, payload.edges),
    }