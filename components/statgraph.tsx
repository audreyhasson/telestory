
export default function StatGraph({reactionArray}) {
    console.log(reactionArray)
    const {laughs, cries, plots, screams, crafts} = reactionArray;
    const orderedArray = {
        "i laughed": laughs,
        "i cried": cries,
        "i screamed": screams,
        "dope plot": plots,
        "great wordwork": crafts,
    }
    const colors = ["bg-dusk-purp"]
    const total = laughs.length + cries.length + plots.length + crafts.length + screams.length;

    function getPercent(arr) {
        if (total===0) {
            return 0
        }
        const percent = Math.floor((arr.length/total) * 100);
        return percent;
    }

    const rows = [];
    let color = true;
    for (let x in orderedArray){
        rows.push(<tr key={x} className={color ? colors[0]+" text-whitish" : ""}>
            <td>{x}</td>
            <td>{getPercent(orderedArray[x]).toString() + "%"}</td>
        </tr>)
        color = !color;
        }
    return (
        <>
            <table className="w-full px-4">
                <tbody>
                    {rows}
                </tbody>
            </table>
            </>
    )
}