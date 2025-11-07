import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import LabelWithValue from "../components/LabelWithValue";
import { db } from "../config/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";
import { Animal } from "../core/listeners/created-animal.listener";
import { AnimalRepository } from "../core/repositories/aninal.repository";

export default function AnimalDetail() {
	const navigation = useNavigation();
	const route = useRoute();
	const { user } = useAuth();
	const { animal, fromMyPets } =  route.params as {animal: Animal; fromMyPets?: boolean};

	const [visible, setVisible] = useState(animal.visivel ?? true);
	const [animalOwnerName, setAnimalOwnerName] = useState<string>("Dono do Pet");

	const getBooleanIfIncluded = (array: Array<string>, value: string, trueFallback: string = "Sim", falseFallback: string = "Não") => array.includes(value) ? trueFallback : falseFallback;

	// Buscar nome do dono do animal
	useEffect(() => {
		const fetchAnimalOwnerName = async () => {
			if (!animal.userId) return;
			
			try {
				const userDoc = await getDoc(doc(db, "users", animal.userId));
				if (userDoc.exists()) {
					const userData = userDoc.data();
					const name = userData.nomeCompleto || userData.name || userData.displayName || "Dono do Pet";
					setAnimalOwnerName(name);
				}
			} catch (error) {
				console.error("Erro ao buscar nome do dono do animal:", error);
			}
		};

		fetchAnimalOwnerName();
	}, [animal.userId]);

	const handleClickAdoptionButton = () => {
		navigation.navigate("ConfirmAdoption" as never);
	}

	const handleStartChat = () => {
		// Verificar se o usuário não está tentando conversar consigo mesmo
		if (user?.uid === animal.userId) {
			alert("Você não pode conversar consigo mesmo!");
			return;
		}
		
		// Verificar se o animal tem ID
		if (!animal.id) {
			alert("Erro: Animal sem ID válido");
			return;
		}
		
		// Navegar para o chat com o dono do animal
		(navigation as any).navigate("ChatScreen", {
			animalOwnerId: animal.userId,
			initiatorId: user?.uid,
			animalId: animal.id,
			otherUserName: animalOwnerName,
			animalName: animal.nome
		});
	}
	const handleToggleVisibility = async () => {
    if (!animal.id) return;

    try {
      await AnimalRepository.toggleVisibility(animal.id, !visible);
      setVisible(!visible);
      alert(`Pet ${!visible ? "tornado visível" : "ocultado"} com sucesso!`);
    } catch (error) {
      console.error(error);
      alert("Erro ao alterar visibilidade do pet.");
    }
  };

	return (	
		<SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
			<ScrollView
				contentContainerStyle={styles.scrollView}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<Image source={{ uri: animal.photoURL }} style={styles.image} />
				<Text style={styles.title}>{animal.nome}</Text>
				
				{/* Botões de ação */}
				<View style={styles.buttonsContainer}>
					<Button text="Pretendo Adotar" type="yellow" onPress={handleClickAdoptionButton} />
					{user?.uid !== animal.userId && (
						<Button text="Iniciar Chat" type="oceanBlue" onPress={handleStartChat} />
					)}
					{fromMyPets === true && (
						<Button
							text={visible ? "Ocultar da adoção" : "Tornar visível novamente"}
							type={visible ? "gray" : "oceanBlue"}
							onPress={handleToggleVisibility}
						/>
					)}
				</View>
				
				<View style={styles.bodyContainer}>
					<View style={[{flexDirection: "row", justifyContent: "space-between", width: "100%"}]}>
						<LabelWithValue
							label="Sexo"
							value={animal.sexo}
						/>
						<LabelWithValue
							label="Porte"
							value={animal.porte}
						/>
						<LabelWithValue
							label="Idade"
							value={animal.faixaEtaria}
						/>
					</View>
					<View style={[{flexDirection: "row", justifyContent: "flex-start", width: "100%"}]}>
						<View style={[{flexDirection: "column", gap: 10, flex: 1}]}>
							<LabelWithValue
								label="Castrado"
								value={getBooleanIfIncluded(animal.saude || [], "castrado")}
							/>
							<LabelWithValue
								label="Vacinado"
								value={getBooleanIfIncluded(animal.saude || [], "vacinado")}
							/>
						</View>
						<View style={[{flexDirection: "column", gap: 10, flex: 1}]}>
							<LabelWithValue
								label="Vermifugado"
								value={getBooleanIfIncluded(animal.saude || [], "vermifugado")}
							/>
							<LabelWithValue
								label="Doenças"
								value={getBooleanIfIncluded(animal.saude || [], "doencas", animal.doencas, "Nenhuma")}
							/>
						</View>
					</View>
					<LabelWithValue
						label="Temperamento"
						value={animal.temperamento?.join(", ") || "Não informado"}
					/>
					<LabelWithValue
						label="Exigências para adoção"
						value={animal.exigenciaAdocao?.join(", ") || "Não informado"}
					/>
					<LabelWithValue
						label="Mais sobre o animal"
						value={animal.sobreAnimal || "Não informado"}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingTop: StatusBar.currentHeight,
	},
	scrollView: {
		flexGrow: 1,
		backgroundColor: "#fff",
		alignItems: "flex-start",
		justifyContent: "flex-start",
	},
  image: {
    width: "100%",
    height: "25%",
    resizeMode: "cover",
  },
	bodyContainer: {
		width: "100%",
		paddingHorizontal: 25,
		paddingVertical: 30,
		gap: 30,
	},
	title: {
		paddingHorizontal: 25,
		paddingTop: 20,
		fontSize: 16,
		color: "#434343",
		textAlign: "center",
		fontFamily: "Roboto-Medium",
		letterSpacing: 0.5
	},
	buttonsContainer: {
		width: "100%",
		paddingHorizontal: 25,
		paddingVertical: 20,
		gap: 15,
		backgroundColor: "#f8f9fa",
		borderBottomWidth: 1,
		borderBottomColor: "#e6e7e8",
	},
});
