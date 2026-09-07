'use client';

import { PlaceholderHead } from './PlaceholderHead';
import { StudioLighting } from './StudioLighting';

/**
 * Face Shape Morph Scene — Scene 4
 *
 * Shows a stylized head that smoothly morphs between 5 face shapes.
 * Camera is fixed at a flattering 3/4 angle.
 * The morph animation is handled internally by PlaceholderHead via lerped scaling.
 */

type FaceShape = 'Oval' | 'Round' | 'Square' | 'Heart' | 'Diamond';

interface FaceShapeMorphSceneProps {
  selectedShape: FaceShape;
}

export const FaceShapeMorphScene = ({ selectedShape }: FaceShapeMorphSceneProps) => {
  return (
    <>
      <StudioLighting showContactShadow={false} />

      <PlaceholderHead shape={selectedShape} scale={1.3} />
    </>
  );
};

export default FaceShapeMorphScene;
