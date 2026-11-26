import React from 'react';
import { SimulatorId, TutorSimulatorContext } from '../../types';
import { SIMULATORS_CATALOG } from '../../simulators/simulatorsData';
import { SimulatorsHub } from './SimulatorsHub';
import {
  SimulatorRunContext,
  SimulatorSpeedProvider,
  SimulatorTutorContext,
} from './SimulatorShell';
import { TrafficSignalStage } from './stages/TrafficSignalStage';
import { AtmDecisionStage } from './stages/AtmDecisionStage';
import { SmartAcStage } from './stages/SmartAcStage';
import { ShoppingDiscountStage } from './stages/ShoppingDiscountStage';
import { ElevatorFloorStage } from './stages/ElevatorFloorStage';
import { CountdownTimerStage } from './stages/CountdownTimerStage';
import { ParkingScannerStage } from './stages/ParkingScannerStage';
import { CashCounterStage } from './stages/CashCounterStage';

interface SimulatorsSectionProps {
  selectedSimulator: SimulatorId | null;
  onSelectSimulator: (id: SimulatorId | null) => void;
  visitedSimulators?: string[];
  onRecordSimulatorRun?: (id: SimulatorId) => void;
  onAskTutor?: (ctx: TutorSimulatorContext) => void;
}

export const SimulatorsSection: React.FC<SimulatorsSectionProps> = ({
  selectedSimulator,
  onSelectSimulator,
  visitedSimulators = [],
  onRecordSimulatorRun,
  onAskTutor,
}) => {
  const handleSelect = (id: SimulatorId) => {
    onSelectSimulator(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    onSelectSimulator(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!selectedSimulator) {
    return (
      <SimulatorsHub
        onSelectSimulator={handleSelect}
        visitedSimulators={visitedSimulators}
      />
    );
  }

  const meta = SIMULATORS_CATALOG.find((s) => s.id === selectedSimulator);
  if (!meta) {
    return (
      <SimulatorsHub
        onSelectSimulator={handleSelect}
        visitedSimulators={visitedSimulators}
      />
    );
  }

  const renderStage = () => {
    switch (selectedSimulator) {
      case 'traffic-signal':
        return <TrafficSignalStage meta={meta} onBackToHub={handleBack} />;
      case 'atm-decision':
        return <AtmDecisionStage meta={meta} onBackToHub={handleBack} />;
      case 'smart-ac':
        return <SmartAcStage meta={meta} onBackToHub={handleBack} />;
      case 'shopping-discount':
        return <ShoppingDiscountStage meta={meta} onBackToHub={handleBack} />;
      case 'elevator-floor':
        return <ElevatorFloorStage meta={meta} onBackToHub={handleBack} />;
      case 'countdown-timer':
        return <CountdownTimerStage meta={meta} onBackToHub={handleBack} />;
      case 'parking-scanner':
        return <ParkingScannerStage meta={meta} onBackToHub={handleBack} />;
      case 'atm-cash-counter':
        return <CashCounterStage meta={meta} onBackToHub={handleBack} />;
    }
  };

  return (
    <SimulatorSpeedProvider>
      <SimulatorRunContext.Provider value={onRecordSimulatorRun ?? null}>
        <SimulatorTutorContext.Provider value={onAskTutor ?? null}>
          {renderStage()}
        </SimulatorTutorContext.Provider>
      </SimulatorRunContext.Provider>
    </SimulatorSpeedProvider>
  );
};
