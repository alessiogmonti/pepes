import * as THREE from "three"
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber"
import { Physics, useSphere } from "@react-three/cannon"
import { Sky, Environment, Effects as EffectComposer, useTexture } from "@react-three/drei"
import { SSAOPass } from "three-stdlib"
// import Model from "./FrogDraco"
import './App.css'

extend({ SSAOPass })

const rfs = THREE.MathUtils.randFloatSpread
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const baubleMaterial = new THREE.MeshStandardMaterial({ color: "rgba(255,255,255,0.2)", roughness: 0, envMapIntensity: 0.1, emissive: "#fffff" })

export const App = () => (
  <div className="App">
    <header className="App-header">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}>
        <ambientLight intensity={0.95} />
        <spotLight intensity={2} angle={0.2} penumbra={1} position={[30, 30, 30]} castShadow shadow-mapSize={[512, 512]} />
        <directionalLight intensity={7} position={[-10, -10, -10]} color="white" />
        <Physics gravity={[0, 2, 0]} iterations={10} size={500}>
          <Pointer />
          {/* <Model /> */}
          <Clump />
        </Physics>
        <Environment files="/adamsbridge.hdr" />
        <Effects />
        <Sky />
      </Canvas>
    </header>
  </div>
)

function Clump({ mat = new THREE.Matrix4(), vec = new THREE.Vector3(), ...props }) {
  const texture = useTexture("/pepe.jpg")
  const [ref, api] = useSphere(() => ({ args: [1], mass: 1, angularDamping: 0.1, linearDamping: 0.65, position: [rfs(20), rfs(20), rfs(20)] }))
  useFrame((state) => {
    for (let i = 0; i < 30; i++) {
      // Get current whereabouts of the instanced sphere
      ref.current.getMatrixAt(i, mat)
      // Normalize the position and multiply by a negative force.
      // This is enough to drive it towards the center-point.
      api.at(i).applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-50).toArray(), [0, 0, 0])
    }
  })
  return <instancedMesh ref={ref} castShadow receiveShadow args={[null, null, 30]} geometry={sphereGeometry} material={baubleMaterial} material-map={texture} />
}

function Pointer() {
  const viewport = useThree((state) => state.viewport)
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [3], position: [0, 0, 0] }))
  return useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0))
}

function Effects(props) {
  const { scene, camera } = useThree()
  return (
    <EffectComposer {...props}>
      <sSAOPass args={[scene, camera, 100, 100]} kernelRadius={1.2} kernelSize={0} />
    </EffectComposer>
  )
}
