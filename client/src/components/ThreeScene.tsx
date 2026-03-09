import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ count = 500 }) => {
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    const instancesRef = useRef<THREE.InstancedMesh>(null);

    useFrame(() => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            const dummy = new THREE.Object3D();
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            instancesRef.current?.setMatrixAt(i, dummy.matrix);
        });
        if (instancesRef.current) {
            instancesRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <Instances ref={instancesRef} range={count} limit={count}>
            <dodecahedronGeometry args={[0.2]} />
            <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2} toneMapped={false} />
            {particles.map((_, i) => (
                <Instance key={i} />
            ))}
        </Instances>
    );
};

const DataNodes = () => {
    return (
        <group>
            {[...Array(15)].map((_, i) => (
                <Float
                    key={i}
                    speed={2}
                    rotationIntensity={2}
                    floatIntensity={2}
                    position={[
                        (Math.random() - 0.5) * 30,
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 20 - 10
                    ]}
                >
                    <mesh>
                        <boxGeometry args={[1, 1, 1]} />
                        <meshStandardMaterial color="#3b82f6" wireframe />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

export const Scene = () => {
    useFrame((state) => {
        // Smooth camera movement based on mouse
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, (state.pointer.x * Math.PI) / 10, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, (state.pointer.y * Math.PI) / 10, 0.05);
        state.camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />

            <color attach="background" args={['#02050a']} />
            <fog attach="fog" args={['#02050a', 10, 40]} />

            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#00f0ff" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
            <pointLight position={[0, 0, 0]} intensity={2} color="#00f0ff" distance={20} />

            <ParticleField count={200} />
            <DataNodes />
            <Sparkles count={500} scale={20} size={2} speed={0.4} opacity={0.5} color="#00f0ff" />

            {/* Grid Floor */}
            <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[100, 100, 40, 40]} />
                <meshBasicMaterial color="#1e3a8a" wireframe transparent opacity={0.15} />
            </mesh>
        </>
    );
};
