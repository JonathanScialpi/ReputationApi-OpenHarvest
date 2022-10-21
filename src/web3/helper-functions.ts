// actionWeight * MaxPayout = NumOfHXToPay

export const calculatePayment = (actionWeight, maxPayout) => {
    return Math.floor((actionWeight/100) * maxPayout);
}

const calculateReputationEarned = (reputationActions: Record<string,boolean>, reputationWeights: Record<string, string>) => {
    let totalRepEarned = 0;
    for(const key in reputationActions){
        totalRepEarned += calculatePayment(reputationActions[key], reputationWeights[key]);
    }
    return totalRepEarned;
}