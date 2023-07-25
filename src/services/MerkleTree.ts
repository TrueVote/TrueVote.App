export class MerkleTree {
  // Calculates the Merkle root hash from string (e.g. json)
  public static async calculateMerkleRootString(data: string): Promise<Uint8Array | null> {
    if (!data) {
      return null;
    }

    // Convert the JSON string to a byte array
    const encoder: TextEncoder = new TextEncoder();
    const leafNodes: Uint8Array = encoder.encode(data);

    // Calculate the Merkle root hash
    return MerkleTree.calculateMerkleRootInternal([leafNodes]);
  }

  // Calculates the Merkle root hash from a list of data
  public static async calculateMerkleRootType<T>(data: T[]): Promise<Uint8Array | null> {
    if (!data || data.length === 0) {
      return null;
    }

    if (data.length === 1) {
      return MerkleTree.getHash(data[0]);
    }

    // Convert each data item to its hash representation (leaf nodes)
    const leafNodes: Uint8Array[] = await Promise.all(data.map(MerkleTree.getHash));

    // Calculate the Merkle root hash
    return MerkleTree.calculateMerkleRootInternal(leafNodes);
  }

  // Calculates the Merkle root hash from a list of leaf nodes
  private static async calculateMerkleRootInternal(leafNodes: Uint8Array[]): Promise<Uint8Array> {
    // Build the Merkle tree by computing parent nodes until only the root remains
    while (leafNodes.length > 1) {
      const parentNodes: Uint8Array[] = [];
      for (let i: number = 0; i < leafNodes.length; i += 2) {
        const left: Uint8Array = leafNodes[i];
        const right: Uint8Array = i + 1 < leafNodes.length ? leafNodes[i + 1] : left;

        const parent: Uint8Array = await MerkleTree.getHashLeftRight(left, right);
        parentNodes.push(parent);
      }
      leafNodes = parentNodes;
    }

    return leafNodes[0];
  }

  // Computes the hash of an object
  public static async getHash<T>(value: T): Promise<Uint8Array> {
    const serializer: Uint8Array = new TextEncoder().encode(JSON.stringify(value));
    const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', serializer);

    // Convert the ArrayBuffer to a Uint8Array
    return new Uint8Array(hashBuffer);
  }

  // Computes the hash of the concatenation of two byte arrays
  public static async getHashLeftRight(left: Uint8Array, right: Uint8Array): Promise<Uint8Array> {
    const buffer: Uint8Array = new Uint8Array(left.length + right.length);
    buffer.set(left, 0);
    buffer.set(right, left.length);

    const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', buffer);

    // Convert the ArrayBuffer to a Uint8Array
    return new Uint8Array(hashBuffer);
  }
}

// Example usage:
const data: string = 'example data';
MerkleTree.calculateMerkleRootString(data)
  .then((merkleRoot: Uint8Array | null) => {
    if (merkleRoot) {
      const hexMerkleRoot: string = Array.from(merkleRoot)
        .map((byte: number) => byte.toString(16).padStart(2, '0'))
        .join('');
      console.info(hexMerkleRoot);
    } else {
      console.warn('Merkle root is null.');
    }
  })
  .catch((error: Error) => {
    console.error('Error calculating Merkle root:', error);
  });
