module.exports = (mongoose) => {
    const schema = mongoose.Schema({



    }, {
        timestamps: false
    });
    const Ponto = mongoose.model("ponto", schema);
    return Ponto;

}