declare module '@sceneview/react-native-sceneform' {
    import { Component } from 'react';
    import { ViewProps } from 'react-native';

    export interface SceneformProps extends ViewProps {
        viewMode?: 'host' | 'resolve';
        displayPlanes?: boolean;
        displayPointCloud?: boolean;
        locationMarkers?: any[];
        discoverMode?: boolean;
        onSessionCreate?: (event: any) => void;
        onTapPlane?: (event: any) => void;
        onAnchorHost?: (event: any) => void;
        onAnchorResolve?: (event: any) => void;
        onFeatureMapQualityChange?: (event: any) => void;
    }

    export class SceneformView extends Component<SceneformProps> {
        addObject(model: { anchorId: string; name: string; isCloudAnchor?: boolean }): void;
        takeScreenshot(): Promise<any>;
        hostCloudAnchor(anchorId: string): void;
        resolveCloudAnchor(anchorId: string): void;
        startVideoRecording(): Promise<boolean>;
        stopVideoRecording(): Promise<any>;
    }

    export class AugmentedFaces View extends Component < any > {}
    export class ModelViewer extends Component<any> { }
}
