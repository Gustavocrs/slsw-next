import {NextResponse} from "next/server";
import {db} from "@/lib/firebase";
import {writeBatch, doc, collection} from "firebase/firestore";
import {
  parseZadmarToughness,
  normalizeZadmarAttributes,
} from "@/lib/swadeEngine";

/**
 * POST /api/bestiary
 * Recebe um array JSON de monstros no formato Zadmar, aplica parser em Toughness/Armadura,
 * normaliza atributos e persiste no Firestore via writeBatch.
 */
export async function POST(request) {
  try {
    const data = await request.json();

    // Suporta o envio direto do array ou encapsulado num objeto { monsters: [...] }
    const monsters = Array.isArray(data) ? data : data.monsters;

    if (!monsters || !Array.isArray(monsters)) {
      return NextResponse.json(
        {error: "Formato inválido. Era esperado um array de monstros."},
        {status: 400},
      );
    }

    const batch = writeBatch(db);
    const bestiaryRef = collection(db, "monsters");

    monsters.forEach((monster) => {
      const normalizedStats = parseZadmarToughness(monster.toughness);
      const normalizedAttributes = normalizeZadmarAttributes(
        monster.attributes,
      );

      const docData = {
        ...monster,
        attributes: normalizedAttributes,
        toughness: normalizedStats.toughness,
        armor: normalizedStats.armor,
        updatedAt: new Date().toISOString(),
      };

      // Utiliza o ID providenciado ou gera um novo caso seja indefinido
      const docRef = monster.id
        ? doc(bestiaryRef, monster.id)
        : doc(bestiaryRef);
      batch.set(docRef, docData, {merge: true});
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      count: monsters.length,
      message: "Bestiário sincronizado com o Firestore.",
    });
  } catch (error) {
    console.error("Erro na API de Bestiário:", error);
    return NextResponse.json(
      {error: "Erro interno ao processar e salvar os monstros."},
      {status: 500},
    );
  }
}
