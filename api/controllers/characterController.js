/**
 * Controllers para Character / Ficha
 */

const Character = require("../models/Character");

// Criar novo personagem
exports.createCharacter = async (req, res) => {
  try {
    const {userId, nome, ...rest} = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId é obrigatório",
      });
    }

    // FIX: Verifica se já existe ficha para este usuário (Singleton)
    let character = await Character.findOne({userId});

    if (character) {
      // Se existe, atualiza
      character = await Character.findOneAndUpdate(
        {userId},
        {...rest, ...(nome && {nome})}, // Atualiza nome apenas se fornecido
        {new: true, runValidators: true},
      );
    } else {
      // Se não existe, cria nova
      if (!nome) return res.status(400).json({error: "Nome é obrigatório"});
      character = await Character.create({userId, nome, ...rest});
    }

    res.status(201).json({
      success: true,
      data: character,
      message: "Personagem criado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar personagem:", error);
    res.status(500).json({
      error: error.message || "Erro ao criar personagem",
    });
  }
};

// Obter todos os personagens do usuário
exports.getCharacters = async (req, res) => {
  try {
    const {userId} = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "userId é obrigatório",
      });
    }

    const characters = await Character.find({userId})
      .sort({updatedAt: -1}) // FIX: Ordenar por atualização para pegar a versão mais recente
      .select("-__v");

    res.json({
      success: true,
      count: characters.length,
      data: characters,
    });
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
    res.status(500).json({
      error: error.message || "Erro ao buscar personagens",
    });
  }
};

// Obter um personagem específico
exports.getCharacter = async (req, res) => {
  try {
    const {id} = req.params;

    const character = await Character.findById(id).select("-__v");

    if (!character) {
      return res.status(404).json({
        error: "Personagem não encontrado",
      });
    }

    // Validar ownership (opcional - recomendado para segurança)
    // const { userId } = req.body;
    // if (character.userId !== userId) {
    //   return res.status(403).json({ error: 'Acesso negado' });
    // }

    res.json({
      success: true,
      data: character,
    });
  } catch (error) {
    console.error("Erro ao buscar personagem:", error);
    res.status(500).json({
      error: error.message || "Erro ao buscar personagem",
    });
  }
};

// Atualizar personagem
exports.updateCharacter = async (req, res) => {
  try {
    const {id} = req.params;
    const updates = req.body;

    // Prevenir atualização de userId e timestamps
    delete updates.userId;
    delete updates._id;
    delete updates.createdAt;

    const character = await Character.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!character) {
      return res.status(404).json({
        error: "Personagem não encontrado",
      });
    }

    res.json({
      success: true,
      data: character,
      message: "Personagem atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar personagem:", error);
    res.status(500).json({
      error: error.message || "Erro ao atualizar personagem",
    });
  }
};

// Deletar personagem
exports.deleteCharacter = async (req, res) => {
  try {
    const {id} = req.params;

    const character = await Character.findByIdAndDelete(id);

    if (!character) {
      return res.status(404).json({
        error: "Personagem não encontrado",
      });
    }

    res.json({
      success: true,
      message: "Personagem deletado com sucesso",
      deletedId: id,
    });
  } catch (error) {
    console.error("Erro ao deletar personagem:", error);
    res.status(500).json({
      error: error.message || "Erro ao deletar personagem",
    });
  }
};

// Duplicar personagem
exports.duplicateCharacter = async (req, res) => {
  try {
    const {id} = req.params;
    const {userId} = req.body;

    const original = await Character.findById(id);

    if (!original) {
      return res.status(404).json({
        error: "Personagem original não encontrado",
      });
    }

    // Criar cópia da ficha
    const duplicate = new Character({
      ...original.toObject(),
      _id: undefined,
      nome: `${original.nome} (Cópia)`,
      userId,
      createdAt: undefined,
      updatedAt: undefined,
    });

    const saved = await duplicate.save();

    res.status(201).json({
      success: true,
      data: saved,
      message: "Personagem duplicado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao duplicar personagem:", error);
    res.status(500).json({
      error: error.message || "Erro ao duplicar personagem",
    });
  }
};

// Stats do personagem (calculados)
exports.getCharacterStats = async (req, res) => {
  try {
    const {id} = req.params;

    const character = await Character.findById(id).select(
      "vigor lutar aparar_bonus armadura_bonus wounds fatigue",
    );

    if (!character) {
      return res.status(404).json({
        error: "Personagem não encontrado",
      });
    }

    // Cálculos
    const vigorVal = parseInt(character.vigor?.replace("d", "") || 6);
    const fightingVal = character.lutar
      ? parseInt(character.lutar.replace("d", ""))
      : 0;

    const stats = {
      defesa: 2 + Math.floor(vigorVal / 2) + (character.armadura_bonus || 0),
      aparar:
        fightingVal > 0
          ? 2 + Math.floor(fightingVal / 2) + (character.aparar_bonus || 0)
          : 0,
      armadura: character.armadura_bonus || 0,
      wounds: character.wounds || 0,
      fatigue: character.fatigue || 0,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Erro ao calcular stats:", error);
    res.status(500).json({
      error: error.message || "Erro ao calcular stats",
    });
  }
};

module.exports = exports;
