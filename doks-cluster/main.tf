terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.37"
    }
  }
}

data "digitalocean_kubernetes_versions" "current" {
  version_prefix = var.version_prefix
}

resource "digitalocean_kubernetes_cluster" "primary" {
  name   = "${var.name}-cluster"
  region = var.region

  version       = data.digitalocean_kubernetes_versions.current.latest_version
  auto_upgrade  = true
  surge_upgrade = true

  maintenance_policy {
    start_time = "04:00"
    day        = "any"
  }

  node_pool {
    name = "${var.name}-node-pool"
    size = var.node_size_slug

    auto_scale = true
    min_nodes  = 1
    max_nodes  = var.max_nodes
  }
}