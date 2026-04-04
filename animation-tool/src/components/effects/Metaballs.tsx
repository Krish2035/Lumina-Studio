import { Float } from '@react-three/drei';

export const Metaballs = () => (
  <group>
    {[...Array(5)].map((_, i) => (
      <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2} position={[(i - 2) * 3, 0, 0]}>
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial color="#3b82f6" roughness={0} metalness={0.8} transparent opacity={0.6} />
        </mesh>
      </Float>
    ))}
  </group>
);