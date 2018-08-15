/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * Sample transaction processor function.
 * @param {org.example.basic.AddParticipant} tx The sample transaction instance.
 * @transaction
 */
async function addParticipant(tx) {  // eslint-disable-line no-unused-vars

    
    const factory = getFactory();

    // Create the bond asset.
    const bondAsset = factory.newResource('org.example.basic', 'SampleParticipant', tx.newParticipant.participantId);
    bondAsset.firstName = tx.newParticipant.firstName;
    bondAsset.lastName = tx.newParticipant.lastName;
  
    const walletAsset = factory.newResource('org.example.basic', 'Wallet', tx.wallet.walletId);
    walletAsset.money = tx.wallet.money;
    walletAsset.owner = tx.newParticipant;

    // Add the bond asset to the registry.
    const participantRegistry = await getParticipantRegistry('org.example.basic.SampleParticipant');
    await participantRegistry.add(bondAsset);
  
    // Add the bond asset to the registry.
    const assetRegistry = await getAssetRegistry('org.example.basic.Wallet');
    await assetRegistry.add(walletAsset);
}

/**
 * Sample transaction processor function.
 * @param {org.example.basic.DelParticipant} tx The sample transaction instance.
 * @transaction
 */
async function delParticipant(tx) {  // eslint-disable-line no-unused-vars

    const registry = await getParticipantRegistry('org.example.basic.SampleParticipant');
    await registry.remove(tx.SampleParticipant);
}

/**
 * Sample transaction processor function.
 * @param {org.example.basic.UpdParticipant} tx The sample transaction instance.
 * @transaction
 */
async function updParticipant(tx) {  // eslint-disable-line no-unused-vars

    const registry = await getParticipantRegistry('org.example.basic.SampleParticipant');
  
    tx.tarParticipant.firstName = tx.firstName;
    tx.tarParticipant.lastName = tx.lastName;
  
    await registry.update(tx.tarParticipant);
}

/**
 * Sample transaction processor function.
 * @param {org.example.basic.TradeMoney} tx The sample transaction instance.
 * @transaction
 */
async function tradeMoney(tx) {  // eslint-disable-line no-unused-vars

    const assestRegistry = await getAssetRegistry('org.example.basic.Wallet');
    
    const assestFrom = await query('selectWalletByOwner', {owner : 'resource:' + tx.ParticipantFrom.getFullyQualifiedIdentifier()});
    const assestTo = await query('selectWalletByOwner', {owner : 'resource:' + tx.ParticipantTo.getFullyQualifiedIdentifier()});
  
    //tx.ParticipantFrom.money = tx.ParticipantFrom.money - tx.value;
    //tx.ParticipantTo.money = tx.ParticipantTo.money + tx.value;
  
    assestFrom.money = assestFrom.money - tx.value;
    assestTo.money = assestTo.money + tx.value;

    await assestRegistry.updateAll([assestFrom, assestTo]);
    //await registry.updateall(tx.ParticipantFrom);
}
