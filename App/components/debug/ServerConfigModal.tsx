import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

interface ServerConfigModalProps {
    visible: boolean;
    onSave: (ip: string) => void;
    onSkip: () => void;
    currentIp: string;
}

export default function ServerConfigModal({
    visible,
    onSave,
    onSkip,
    currentIp,
}: ServerConfigModalProps) {
    const [ip, setIp] = useState(currentIp);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Configure Server IP</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setIp}
                        value={ip}
                        placeholder="192.168.1.1"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={onSkip}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSave]}
                            onPress={() => onSave(ip)}
                        >
                            <Text style={styles.textStyle}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "80%",
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
        minWidth: 80,
    },
    buttonClose: {
        backgroundColor: "#FF5252",
    },
    buttonSave: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: "100%",
        borderRadius: 5,
        borderColor: "#ccc",
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
});
